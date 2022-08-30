import type { Term as TermType} from "@prisma/client";

export default function Term(props: TermType) {
  return <p>{props.term}</p>;
}
