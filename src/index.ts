import { VueConstructor } from 'vue';

import { ActionSheet } from '@/components/action-sheet';
import { Alert } from '@/components/alert';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button, ButtonGroup } from '@/components/button';
import { Cell, CellGroup } from '@/components/cell';
import { CheckBox, CheckBoxGroup, CheckIndicator } from '@/components/check-box';
import { Chip } from '@/components/chip';
import { Collapse, CollapseItem } from '@/components/collapse';
import { Dialog } from '@/components/dialog';
// import Dialog from '@/components/drawer';
import { FontIcon, Icon, SvgIcon } from '@/components/icon';
import { Image } from '@/components/image';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Menu, MenuItem } from '@/components/menu';
// import { MenuBar } from '@/components/menu-bar';
import { Overlay } from '@/components/overlay';
import { PageIndicator } from '@/components/page-indicator';
import { Popover } from '@/components/popover';
import { Popup } from '@/components/popup';
import { ProgressBar, ProgressCircular } from '@/components/progress';
import { RadioButton, RadioButtonGroup, RadioIndicator } from '@/components/radio-button';
import { RangeSlider } from '@/components/range-slider';
import { Refresher } from '@/components/refresher';
// import { Select } from '@/components/select';
// import { SelectOption } from '@/components/select-option';
import { Switch, SwitchGroup, SwitchIndicator } from '@/components/switch';
import { TabBar } from '@/components/tab-bar';
// import { Tab, Tabs } from '@/components/tabs';
import { TextArea } from '@/components/text-area';
import { ToolTip } from '@/components/tooltip';

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}
const components = [
  ActionSheet,
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Cell,
  CellGroup,
  CheckIndicator,
  CheckBox,
  CheckBoxGroup,
  Chip,
  Collapse,
  CollapseItem,
  Dialog,
  FontIcon,
  SvgIcon,
  Icon,
  Image,
  Input,
  Label,
  Menu,
  MenuItem,
  // MenuBar,
  Overlay,
  PageIndicator,
  Popover,
  Popup,
  ProgressBar,
  ProgressCircular,
  RadioIndicator,
  RadioButton,
  RadioButtonGroup,
  RangeSlider,
  Refresher,
  // Select,
  // SelectOption,
  SwitchIndicator,
  Switch,
  SwitchGroup,
  TabBar,
  // Tabs,
  // Tab,
  TextArea,
  ToolTip,
];

const install = (Vue: VueConstructor) => {
  components.forEach(Component => {
    Vue.use(Component as any);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,

  ActionSheet,
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Cell,
  CellGroup,
  CheckIndicator,
  CheckBox,
  CheckBoxGroup,
  Chip,
  Collapse,
  CollapseItem,
  Dialog,
  FontIcon,
  SvgIcon,
  Icon,
  Image,
  Input,
  Label,
  Menu,
  MenuItem,
  // MenuBar,
  Overlay,
  PageIndicator,
  Popover,
  Popup,
  ProgressBar,
  ProgressCircular,
  RadioIndicator,
  RadioButton,
  RadioButtonGroup,
  RangeSlider,
  Refresher,
  // Select,
  // SelectOption,
  SwitchIndicator,
  Switch,
  SwitchGroup,
  TabBar,
  // Tabs,
  // Tab,
  TextArea,
  ToolTip,
};
