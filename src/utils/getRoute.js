import { getRouters } from '@/api/menu'

export function getIndexRouters() {
    getRouters(res=>{
        console.log(res);
        if(res.code==200){

            return res.data[0].path
        }else{
            return false
        }
    })
}