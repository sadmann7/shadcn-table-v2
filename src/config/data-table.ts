import { MixIcon, SquareIcon } from "@radix-ui/react-icons"

export type DataTableConfig = typeof dataTableConfig

export const dataTableConfig = {
  featureFlags: [
    {
      label: "Advanced filter",
      value: "advancedFilter" as const,
      icon: MixIcon,
      tooltipTitle: "Toggle advanced filter",
      tooltipDescription: "An airtable like query builder to filter rows.",
    },
    {
      label: "Floating bar",
      value: "floatingBar" as const,
      icon: SquareIcon,
      tooltipTitle: "Toggle floating bar",
      tooltipDescription: "A floating bar that sticks to the top of the table.",
    },
  ],
  textOperators: [
    { label: "Contains", value: "iLike" as const },
    { label: "Does not contain", value: "notILike" as const },
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
    { label: "Is empty", value: "isEmpty" as const },
    { label: "Is not empty", value: "isNotEmpty" as const },
  ],
  numericOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
    { label: "Is less than", value: "lt" as const },
    { label: "Is less than or equal to", value: "lte" as const },
    { label: "Is greater than", value: "gt" as const },
    { label: "Is greater than or equal to", value: "gte" as const },
    { label: "Is empty", value: "isEmpty" as const },
    { label: "Is not empty", value: "isNotEmpty" as const },
  ],
  dateOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
    { label: "Is before", value: "isBefore" as const },
    { label: "Is after", value: "isAfter" as const },
    { label: "Is on or before", value: "isOnOrBefore" as const },
    { label: "Is on or after", value: "isOnOrAfter" as const },
    { label: "Is between", value: "isBetween" as const },
    { label: "Is relative to today", value: "isRelativeToToday" as const },
    { label: "Is empty", value: "isEmpty" as const },
    { label: "Is not empty", value: "isNotEmpty" as const },
  ],
  selectOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
    { label: "Is empty", value: "isEmpty" as const },
    { label: "Is not empty", value: "isNotEmpty" as const },
  ],
  booleanOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
  ],
  joinOperators: [
    { label: "And", value: "and" as const },
    { label: "Or", value: "or" as const },
  ],
}
