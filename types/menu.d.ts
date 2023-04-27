import type * as NativeUI from "../lib/NativeUI/NativeUi";

export type SelectedItem =
    | NativeUI.UIMenuListItem
    | NativeUI.UIMenuSliderItem
    | NativeUI.UIMenuCheckboxItem
    | NativeUI.UIMenuAutoListItem;
