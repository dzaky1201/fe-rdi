import {parseCookies} from "nookies";
import {redirect} from "next/navigation";


export default function CheckSession(){
    const cookies = parseCookies()
    if (!cookies.token){
        redirect('/')
    }
}