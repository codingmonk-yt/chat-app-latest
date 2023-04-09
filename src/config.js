// @mui
import { enUS, frFR, zhCN, viVN, arSD } from '@mui/material/locale';

// routes
import { PATH_DASHBOARD } from "./routes/paths";

export const BASE_URL = "https://api.chat.codingmonk.in/";

export const S3_BUCKET_NAME = 'codingmonk';
export const AWS_ACCESS_KEY = 'AKIARPJQ4HSYLBIK2TDE';
export const AWS_SECRET_ACCESS_KEY = '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';
export const AWS_S3_REGION = 'ap-south-1'; // eg. ap-south-1

export const defaultSettings = {
  themeMode: "light",
  themeDirection: "ltr",
  themeContrast: "default",
  themeLayout: "horizontal",
  themeColorPresets: "default",
  themeStretch: false,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    label: 'French',
    value: 'fr',
    systemValue: frFR,
    icon: '/assets/icons/flags/ic_flag_fr.svg',
  },
  {
    label: 'Vietnamese',
    value: 'vn',
    systemValue: viVN,
    icon: '/assets/icons/flags/ic_flag_vn.svg',
  },
  {
    label: 'Chinese',
    value: 'cn',
    systemValue: zhCN,
    icon: '/assets/icons/flags/ic_flag_cn.svg',
  },
  {
    label: 'Arabic (Sudan)',
    value: 'ar',
    systemValue: arSD,
    icon: '/assets/icons/flags/ic_flag_sa.svg',
  },
];

export const defaultLang = allLangs[0]; // English



// DEFAULT ROOT PATH
export const DEFAULT_PATH = PATH_DASHBOARD.general.app; // as '/app'
