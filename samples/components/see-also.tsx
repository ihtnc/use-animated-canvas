import { MenuItem } from '@/app/usage'

type SeeAlsoProps = {
  references?: Array<MenuItem>
}

export default function SeeAlso({references}: SeeAlsoProps) {
  if (references === undefined || references.length === 0) { return null }

  return (<>
    <h3 className='text-xl font-semibold mb-4'>See also</h3>
    <div className='flex flex-row'>{
      references.map((item, i) =>
        <span key={i} className='flex px-1'>[
          <a href={item.href}
            className='text-blue-500'>
            {item.label}
          </a>
        ]</span>
      )
    }</div>
  </>)
}
