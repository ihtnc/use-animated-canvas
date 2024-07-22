import { MenuItem } from '@/app/usage'

type SeeAlsoProps = {
  references?: Array<MenuItem>
}

export default function SeeAlso({references}: SeeAlsoProps) {
  if (references === undefined || references.length === 0) { return null }

  return (<>
    <h3 className='text-xl font-semibold mb-4'>See also</h3>
    <ul className='flex'>{
      references.map((item, i) =>
        <li key={i}>
          <a href={item.href}
            className='rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'>
            {item.label}
          </a>
        </li>
      )
    }</ul>
  </>)
}
