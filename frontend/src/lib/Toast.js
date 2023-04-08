import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Toast
{
    constructor(message = "Success", type = "success")
    {
        this.toast = toast;
        this.type = type;
        this.message = message;

        switch (this.type)
        {
            case "success":
                this.toast = toast.success;
                break;
            case "error":
                this.toast = toast.error;
                break;
            case "info":
                this.toast = toast.info;
                break;
            case "warning":
                this.toast = toast.warn;
                break;
            default:
                this.toast = toast;
                break;
        }

        this.toast(this.message)
    }
}