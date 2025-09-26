// Global types shared across the mobile
declare global {
  declare module "*.svg" {
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

  type Example = {
    name: string;
  };
}

// Required to ensure TypeScript treats this file as a module
export = {};
