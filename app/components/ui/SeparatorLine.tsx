interface Props {
  width?: string;
}
export default function SeparatorLine({ width = "full" }: Props) {
  return (
    <span
      className={`w-${width} h-1 bg-(--separator-primary) rounded-md my-2`}
    ></span>
  );
}
