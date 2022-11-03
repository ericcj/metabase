import _ from "underscore";
import { Parameter } from "metabase-types/types/Parameter";

export function getParameterType(parameter: Parameter | string) {
  return typeof parameter === "string"
    ? splitType(parameter)[0]
    : parameter.sectionId || splitType(parameter)[0];
}

export function getParameterSubType(parameter: Parameter) {
  const [, subtype] = splitType(parameter);
  return subtype;
}

function splitType(parameterOrType: Parameter | string) {
  const parameterType = _.isString(parameterOrType)
    ? parameterOrType
    : parameterOrType?.type || "";

  return parameterType.split("/");
}

export function isDateParameter(parameter: Parameter | string) {
  const type = getParameterType(parameter);
  return type === "date";
}

export function isNumberParameter(parameter: Parameter) {
  const type = getParameterType(parameter);
  return type === "number";
}

export function isStringParameter(parameter: Parameter) {
  const type = getParameterType(parameter);
  return type === "string";
}
