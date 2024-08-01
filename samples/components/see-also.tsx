import { MenuItem } from '@/app/usage'
import PageLink from '@/components/page-link'

type SeeAlsoProps = {
  references?: Array<MenuItem>
}

export default function SeeAlso({references}: SeeAlsoProps) {
  if (references === undefined || references.length === 0) { return null }

  return (<>
    <h3 className='text-xl font-semibold mb-4'>See also</h3>
    <div className='flex flex-row'>{
      references.map((item, i) =>
        <PageLink href={item.href} label={item.label} key={i} />
      )
    }</div>
  </>)
}
