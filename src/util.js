import { MdBluetoothAudio } from "react-icons/md";
import content from "./content.json"

export const translate = (language, value) => {
    if(language && value)
        return content[value][language];
    else
        return "";
}
