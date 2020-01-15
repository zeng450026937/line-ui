/* eslint-disable sort-imports, object-curly-newline */
import { VueConstructor } from 'vue';

import '@/style/skyline.bundle.scss';
import '@/themes/skyline.globals.ios.scss';

import { ActionGroup, Action } from '@/components/action';
import { ActionSheet } from '@/components/action-sheet';
import { Alert } from '@/components/alert';
import { App } from '@/components/app';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { BusyIndicator } from '@/components/busy-indicator';
import { ButtonGroup, Button } from '@/components/button';
import { CellGroup, Cell } from '@/components/cell';
import { CheckBoxGroup, CheckBox, CheckIndicator } from '@/components/check-box';
import { Chip } from '@/components/chip';
import { CollapseItem, Collapse } from '@/components/collapse';
import { Content } from '@/components/content';
import { Dialog } from '@/components/dialog';
import { Fab } from '@/components/fab';
import { FabButton } from '@/components/fab-button';
import { FabGroup } from '@/components/fab-group';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { CheckGroup, CheckItem, Lazy, TreeItem } from '@/components/hoc';
import { FontIcon, Icon, SvgIcon } from '@/components/icon';
import { Image } from '@/components/image';
import { Input } from '@/components/input';
import { Item } from '@/components/item';
import { Label } from '@/components/label';
import { List } from '@/components/list';
import { ListItem, ListView } from '@/components/list-view';
import { Loading } from '@/components/loading';
import { Overlay } from '@/components/overlay';
import { PageIndicator } from '@/components/page-indicator';
import { Popover } from '@/components/popover';
import { PopupLegacy, Popup } from '@/components/popup';
import { ProgressBar, ProgressCircular } from '@/components/progress';
import { Radio } from '@/components/radio';
import { RadioButtonGroup, RadioButton, RadioIndicator } from '@/components/radio-button';
import { Range } from '@/components/range';
import { RangeSlider } from '@/components/range-slider';
import { Refresher } from '@/components/refresher';
import { Slider } from '@/components/slider';
import { Spinner } from '@/components/spinner';
import { Stepper } from '@/components/stepper';
import { SwitchGroup, SwitchIndicator, Switch } from '@/components/switch';
import { TabBar } from '@/components/tab-bar';
import { TabButton } from '@/components/tab-button';
import { Tab, Tabs } from '@/components/tabs';
import { Textarea } from '@/components/text-area';
import { Thumbnail } from '@/components/thumbnail';
import { Toast } from '@/components/toast';
import { Toolbar } from '@/components/tool-bar';
import { Title } from '@/components/tool-title';
import { Tooltip } from '@/components/tooltip';

const install = (Vue: VueConstructor) => {
  Vue.use(ActionGroup);
  Vue.use(Action);
  Vue.use(ActionSheet);
  Vue.use(Alert);
  Vue.use(App);
  Vue.use(Avatar);
  Vue.use(Badge);
  Vue.use(BusyIndicator);
  Vue.use(ButtonGroup);
  Vue.use(Button);
  Vue.use(CellGroup);
  Vue.use(Cell);
  Vue.use(CheckBoxGroup);
  Vue.use(CheckBox);
  Vue.use(CheckIndicator);
  Vue.use(Chip);
  Vue.use(CollapseItem);
  Vue.use(Collapse);
  Vue.use(Content);
  Vue.use(Dialog);
  Vue.use(Fab);
  Vue.use(FabButton);
  Vue.use(FabGroup);
  Vue.use(Footer);
  Vue.use(Header);
  Vue.use(CheckGroup);
  Vue.use(CheckItem);
  Vue.use(Lazy);
  Vue.use(TreeItem);
  Vue.use(FontIcon);
  Vue.use(Icon);
  Vue.use(SvgIcon);
  Vue.use(Image);
  Vue.use(Input);
  Vue.use(Item);
  Vue.use(Label);
  Vue.use(List);
  Vue.use(ListItem);
  Vue.use(ListView);
  Vue.use(Loading);
  Vue.use(Overlay);
  Vue.use(PageIndicator);
  Vue.use(Popover);
  Vue.use(PopupLegacy);
  Vue.use(Popup);
  Vue.use(ProgressBar);
  Vue.use(ProgressCircular);
  Vue.use(Radio);
  Vue.use(RadioButtonGroup);
  Vue.use(RadioButton);
  Vue.use(RadioIndicator);
  Vue.use(Range);
  Vue.use(RangeSlider);
  Vue.use(Refresher);
  Vue.use(Slider);
  Vue.use(Spinner);
  Vue.use(Stepper);
  Vue.use(SwitchGroup);
  Vue.use(SwitchIndicator);
  Vue.use(Switch);
  Vue.use(TabBar);
  Vue.use(TabButton);
  Vue.use(Tab);
  Vue.use(Tabs);
  Vue.use(Textarea);
  Vue.use(Thumbnail);
  Vue.use(Toast);
  Vue.use(Toolbar);
  Vue.use(Title);
  Vue.use(Tooltip);
};

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const version = process.env.VUE_APP_VERSION;

export default {
  install,
  version,

  ActionGroup,
  Action,
  ActionSheet,
  Alert,
  App,
  Avatar,
  Badge,
  BusyIndicator,
  ButtonGroup,
  Button,
  CellGroup,
  Cell,
  CheckBoxGroup,
  CheckBox,
  CheckIndicator,
  Chip,
  CollapseItem,
  Collapse,
  Content,
  Dialog,
  Fab,
  FabButton,
  FabGroup,
  Footer,
  Header,
  CheckGroup,
  CheckItem,
  Lazy,
  TreeItem,
  FontIcon,
  Icon,
  SvgIcon,
  Image,
  Input,
  Item,
  Label,
  List,
  ListItem,
  ListView,
  Loading,
  Overlay,
  PageIndicator,
  Popover,
  PopupLegacy,
  Popup,
  ProgressBar,
  ProgressCircular,
  Radio,
  RadioButtonGroup,
  RadioButton,
  RadioIndicator,
  Range,
  RangeSlider,
  Refresher,
  Slider,
  Spinner,
  Stepper,
  SwitchGroup,
  SwitchIndicator,
  Switch,
  TabBar,
  TabButton,
  Tab,
  Tabs,
  Textarea,
  Thumbnail,
  Toast,
  Toolbar,
  Title,
  Tooltip,
};
