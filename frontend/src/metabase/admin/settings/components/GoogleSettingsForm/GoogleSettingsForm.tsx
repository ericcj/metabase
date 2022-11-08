import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { jt, t } from "ttag";
import * as Yup from "yup";
import _ from "underscore";
import MetabaseSettings from "metabase/lib/settings";
import ExternalLink from "metabase/core/components/ExternalLink";
import FormProvider from "metabase/core/components/FormProvider";
import FormInput from "metabase/core/components/FormInput";
import FormSubmitButton from "metabase/core/components/FormSubmitButton";
import FormErrorMessage from "metabase/core/components/FormErrorMessage";
import Breadcrumbs from "metabase/components/Breadcrumbs";
import { updateGoogleSettings } from "metabase/admin/settings/settings";
import { SettingDefinition } from "metabase-types/api";
import {
  GoogleForm,
  GoogleFormCaption,
  GoogleFormHeader,
} from "./GoogleSettingsForm.styled";

const ENABLED_KEY = "google-auth-enabled";
const CLIENT_ID_KEY = "google-auth-client-id";
const DOMAIN_KEY = "google-auth-auto-create-accounts-domain";

const BREADCRUMBS = [
  [t`Authentication`, "/admin/settings/authentication"],
  [t`Google Sign-In`],
];

export interface GoogleSettings {
  [ENABLED_KEY]: boolean;
  [CLIENT_ID_KEY]: string | null;
  [DOMAIN_KEY]: string | null;
}

const GoogleSettingsSchema = Yup.object({
  [CLIENT_ID_KEY]: Yup.string().required(t`required`),
  [DOMAIN_KEY]: Yup.string(),
});

export interface GoogleSettingsFormProps {
  elements?: SettingDefinition[];
  settingValues?: Partial<GoogleSettings>;
  hasMultipleDomains?: boolean;
  onSubmit: (settingValues: GoogleSettings) => void;
}

const GoogleSettingsForm = ({
  elements = [],
  settingValues = {},
  hasMultipleDomains,
  onSubmit,
}: GoogleSettingsFormProps): JSX.Element => {
  const isEnabled = settingValues[ENABLED_KEY];

  const settings = useMemo(() => {
    return _.indexBy(elements, "key");
  }, [elements]);

  const initialValues = useMemo(() => {
    return getInitialValues(settingValues);
  }, [settingValues]);

  const handleSubmit = useCallback(
    (values: GoogleSettings) => {
      return onSubmit(getSubmitValues(values));
    },
    [onSubmit],
  );

  return (
    <FormProvider
      initialValues={initialValues}
      validationSchema={GoogleSettingsSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ dirty }) => (
        <GoogleForm disabled={!dirty}>
          <Breadcrumbs crumbs={BREADCRUMBS} />
          <GoogleFormHeader>{t`Sign in with Google`}</GoogleFormHeader>
          <GoogleFormCaption>
            {t`Allows users with existing Metabase accounts to login with a Google account that matches their email address in addition to their Metabase username and password.`}
          </GoogleFormCaption>
          <GoogleFormCaption>
            {jt`To allow users to sign in with Google you'll need to give Metabase a Google Developers console application client ID. It only takes a few steps and instructions on how to create a key can be found ${(
              <ExternalLink key="link" href={getDocsLink()}>
                {t`here`}
              </ExternalLink>
            )}.`}
          </GoogleFormCaption>
          <FormInput
            name={CLIENT_ID_KEY}
            title={t`Client ID`}
            placeholder={t`{your-client-id}.apps.googleusercontent.com`}
            {...getSettingOverrides(settings[CLIENT_ID_KEY])}
          />
          <FormInput
            name={DOMAIN_KEY}
            title={t`Domain`}
            description={
              hasMultipleDomains
                ? t`Allow users to sign up on their own if their Google account email address is from one of the domains you specify here:`
                : t`Allow users to sign up on their own if their Google account email address is from:`
            }
            placeholder={
              hasMultipleDomains
                ? "mycompany.com, example.com.br, otherdomain.co.uk"
                : "mycompany.com"
            }
            {...getSettingOverrides(settings[DOMAIN_KEY])}
          />
          <FormSubmitButton
            title={isEnabled ? t`Save changes` : t`Save and enable`}
            primary
            disabled={!dirty}
          />
          <FormErrorMessage />
        </GoogleForm>
      )}
    </FormProvider>
  );
};

const getInitialValues = (values: Partial<GoogleSettings>): GoogleSettings => ({
  [ENABLED_KEY]: true,
  [CLIENT_ID_KEY]: values[CLIENT_ID_KEY] || "",
  [DOMAIN_KEY]: values[DOMAIN_KEY] || "",
});

const getSubmitValues = (values: GoogleSettings): GoogleSettings => ({
  ...values,
  [DOMAIN_KEY]: values[DOMAIN_KEY] || null,
});

const getSettingOverrides = (setting?: SettingDefinition) => {
  if (setting?.is_env_setting) {
    return { placeholder: t`Using ${setting.env_name}`, readOnly: true };
  }
};

const getDocsLink = (): string => {
  return MetabaseSettings.docsUrl(
    "people-and-groups/google-and-ldap",
    "enabling-google-sign-in",
  );
};

const mapDispatchToProps = {
  onSubmit: updateGoogleSettings,
};

export default connect(null, mapDispatchToProps)(GoogleSettingsForm);
