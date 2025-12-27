import { FaGithub } from "react-icons/fa";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className=" p-10 flex flex-col gap-3 items-center justify-center">
      <p>
        Created by <span className="font-semibold">zgfpeter</span>
      </p>
      <Link
        href={"https://github.com/zgfpeter/finance-dashboard"}
        className="flex items-center gap-1 underline"
        target="_blank"
      >
        View on GitHub
        <FaGithub />
      </Link>
    </footer>
  );
}
