const generateId = () => {
  return `${Date.now().valueOf()}_${Math.random()}`;
};

const STYLE_KEY_PATTERN = /^((.+S)|s)tyles?$/;

const mergeProps = <T extends Record<string, any>>(
  ...propsArray: (Partial<T> | undefined)[]
): T => {
  const allKeysObj: Record<string, boolean> = {};
  propsArray.forEach((props) => {
    if (props && typeof props === 'object') {
      Object.keys(props).forEach((key) => {
        allKeysObj[key] = true;
      });
    }
  });
  const allKeys = Object.keys(allKeysObj);
  const result: any = {};
  allKeys.forEach((key) => {
    const isStyleProp = STYLE_KEY_PATTERN.test(key);
    if (isStyleProp) {
      const styleValues: unknown[] = [];
      propsArray.forEach((props) => {
        if (props && key in props) {
          const value = props[key];
          if (value != null) {
            styleValues.push(value);
          }
        }
      });
      if (styleValues.length > 0) {
        result[key] = styleValues.length === 1 ? styleValues[0] : styleValues;
      }
    } else {
      for (let i = propsArray.length - 1; i >= 0; i--) {
        const props = propsArray[i];
        if (props && key in props) {
          result[key] = props[key];
          break;
        }
      }
    }
  });
  return result as T;
};

export { generateId, mergeProps };
