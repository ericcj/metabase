/* eslint-disable react/prop-types */
import React, { useCallback, useMemo } from "react";
import _ from "underscore";

import Icon from "metabase/components/Icon";

import { ItemRoot, ItemContent, ItemTitle, ExpandButton } from "./Item.styled";

const Item = ({
  item,
  name,
  icon,
  color,
  selected,
  canSelect,
  hasChildren,
  onChange,
  onChangeParentId,
}) => {
  const handleClick = useMemo(() => {
    if (canSelect) {
      return () => onChange(item);
    }
    if (hasChildren) {
      return () => onChangeParentId(item.id);
    }
    return;
  }, [item, canSelect, hasChildren, onChange, onChangeParentId]);

  const handleExpand = useCallback(
    event => {
      event.stopPropagation();
      onChangeParentId(item.id);
    },
    [item, onChangeParentId],
  );

  const iconProps = useMemo(
    () => (_.isObject(icon) ? icon : { name: icon }),
    [icon],
  );

  return (
    <ItemRoot
      onClick={handleClick}
      canSelect={canSelect}
      isSelected={selected}
      hasChildren={hasChildren}
      data-testid="item-picker-item"
    >
      <ItemContent>
        <Icon size={22} {...iconProps} color={selected ? "white" : color} />
        <ItemTitle>{name}</ItemTitle>
        {hasChildren && (
          <ExpandButton canSelect={canSelect} onClick={handleExpand}>
            <Icon name="chevronright" />
          </ExpandButton>
        )}
      </ItemContent>
    </ItemRoot>
  );
};

export default Item;
