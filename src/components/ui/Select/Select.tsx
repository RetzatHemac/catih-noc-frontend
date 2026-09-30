import { useEffect, useId, useRef, useState, type AriaAttributes } from "react";
import ReactSelect, {
  components,
  type InputProps,
  type MultiValue,
  type SingleValue,
} from "react-select";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
interface BaseSelectProps extends AriaAttributes {
  options: SelectOption[];
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}
export type SelectProps = BaseSelectProps &
  (
    | {
        multiple?: false;
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
      }
    | {
        multiple: true;
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );

function SelectInput(props: InputProps<SelectOption, boolean>) {
  // react-select supplies its own description; keep the form's error/help too.
  const selectProps = props.selectProps as typeof props.selectProps &
    AriaAttributes;
  const description = [
    props["aria-describedby"],
    selectProps["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <components.Input {...props} aria-describedby={description || undefined} />
  );
}

/** Features keep IDs in their state; option objects and search belong to the UI. */
export function Select(props: SelectProps) {
  const {
    options,
    id,
    name,
    placeholder = "Seleccionar...",
    className,
    disabled,
    required,
  } = props;
  const instanceId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<string | string[]>(
    props.defaultValue ?? (props.multiple ? [] : ""),
  );
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const selected = props.value ?? internalValue;

  useEffect(() => {
    const form = root.current?.closest("form");
    function reset() {
      setInternalValue(props.defaultValue ?? (props.multiple ? [] : ""));
      setQuery("");
      setOpen(false);
    }
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [props.defaultValue, props.multiple]);

  function change(
    option: SingleValue<SelectOption> | MultiValue<SelectOption>,
  ) {
    if (disabled || root.current?.closest("fieldset:disabled")) return;
    if (props.multiple) {
      const values = (option as MultiValue<SelectOption>).map(
        (item) => item.value,
      );
      setInternalValue(values);
      props.onValueChange?.(values);
    } else {
      const value = (option as SingleValue<SelectOption>)?.value ?? "";
      setInternalValue(value);
      props.onValueChange?.(value);
    }
  }
  return (
    <div
      ref={root}
      className={[styles.select, className].filter(Boolean).join(" ")}
    >
      <ReactSelect<SelectOption, boolean>
        unstyled
        components={{ Input: SelectInput }}
        instanceId={instanceId}
        inputId={id ?? instanceId}
        name={name}
        options={options}
        value={(Array.isArray(selected) ? selected : [selected]).flatMap(
          (value) => {
            const option = options.find((item) => item.value === value);
            return option ? [option] : [];
          },
        )}
        onChange={change}
        inputValue={query}
        onInputChange={setQuery}
        isMulti={props.multiple ?? false}
        isSearchable
        isClearable={!required}
        isDisabled={disabled}
        isOptionDisabled={(option) => option.disabled ?? false}
        required={required}
        placeholder={placeholder}
        menuIsOpen={open && !disabled}
        onMenuOpen={() => {
          if (root.current?.closest("fieldset:disabled")) return;
          setPortal(
            root.current?.closest<HTMLElement>('[role="dialog"]') ??
              document.body,
          );
          setOpen(true);
        }}
        onMenuClose={() => setOpen(false)}
        menuPortalTarget={portal}
        menuPosition="fixed"
        menuPlacement="auto"
        maxMenuHeight={240}
        closeMenuOnSelect={!props.multiple}
        blurInputOnSelect={!props.multiple}
        tabSelectsValue={false}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) event.stopPropagation();
        }}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        aria-describedby={props["aria-describedby"]}
        aria-invalid={props["aria-invalid"]}
        aria-required={required}
        noOptionsMessage={() => "Sin coincidencias"}
        screenReaderStatus={({ count }) => `${count} opciones disponibles`}
        ariaLiveMessages={{
          guidance: () =>
            "Escribe para buscar. Usa las flechas para recorrer las opciones, Enter para seleccionar y Escape para cerrar.",
          onChange: ({ label, action }) =>
            action === "clear"
              ? "Selección borrada"
              : `${label ?? "Opción"}: ${action === "select-option" ? "seleccionada" : "eliminada"}`,
          onFocus: ({ label }) => label,
          onFilter: ({ resultsMessage }) => resultsMessage,
        }}
        classNames={{
          control: ({ isFocused, isDisabled }) =>
            [
              styles.control,
              isFocused && styles.focused,
              isDisabled && styles.disabled,
              (props["aria-invalid"] === true ||
                props["aria-invalid"] === "true") &&
                styles.invalid,
            ]
              .filter(Boolean)
              .join(" "),
          valueContainer: () => styles.values ?? "",
          input: () => styles.input ?? "",
          placeholder: () => styles.placeholder ?? "",
          singleValue: () => styles.singleValue ?? "",
          indicatorsContainer: () => styles.indicators ?? "",
          dropdownIndicator: () => styles.indicator ?? "",
          clearIndicator: () => styles.indicator ?? "",
          menu: () => styles.menu ?? "",
          menuList: () => styles.menuList ?? "",
          option: ({ isFocused, isSelected, isDisabled }) =>
            [
              styles.option,
              isFocused && styles.optionFocused,
              isSelected && styles.optionSelected,
              isDisabled && styles.optionDisabled,
            ]
              .filter(Boolean)
              .join(" "),
          multiValue: () => styles.tag ?? "",
          multiValueLabel: () => styles.tagLabel ?? "",
          multiValueRemove: () => styles.tagRemove ?? "",
          noOptionsMessage: () => styles.empty ?? "",
        }}
        styles={{
          control: (base) => ({ ...base, minHeight: 44 }),
          menuPortal: (base) => ({ ...base, zIndex: 2000 }),
        }}
      />
    </div>
  );
}
