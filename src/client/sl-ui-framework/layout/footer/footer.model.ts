export interface HyperlinkItem {
  order: number;
  label: string;
  url: string;
  isActive: boolean;
  isPopup?: boolean;
  linkType?: HyperLinkType;
}


export enum HyperLinkType {
    None = 0,
    EULA = 1
}

export interface FooterData {
  policyContent: string;
  copyRightContent: string;
  logosrc: string;
  hyperlinkItems: HyperlinkItem[];
}

export interface EulaConfig {
  version: string;
  companyCode: string;
  consent: string;
}

