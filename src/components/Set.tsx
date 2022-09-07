import { Set as SetType } from "@prisma/client";

export default function Set(props: SetType){
    return <a href={"/sets/"+props.id}>
        {props.title}
    </a>
}