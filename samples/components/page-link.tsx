import Link from "next/link"

type PageLinkProps = {
  href: string,
  label: string
}

export default function PageLink({href, label}: PageLinkProps) {
  return (<span className='flex hover:gap-x-1.5 hover:ml-0 hover:mr-0 group-hover:gap-x-1.5 group-hover:ml-0 group-hover:mr-0 ml-1.5 mr-1.5 cursor-pointer'>
    <span>[</span>
    <Link href={href} className='text-blue-500'>
      {label}
    </Link>
    <span>]</span>
  </span>)
}