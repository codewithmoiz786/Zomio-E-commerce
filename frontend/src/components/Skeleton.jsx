const SkeletonCard = () => {
  return (
    <div className='lg:bg-zinc-100 h-full rounded-xl overflow-hidden border-zinc-300 p-1 flex-col animate-pulse'>
      <div className='w-full h-40 bg-gray-300 rounded'></div> {/* image jagah */}
      <div className='px-2 mt-2 space-y-2'>
        <div className='h-4 bg-gray-300 rounded w-3/4'></div> {/* title */}
        <div className='h-3 bg-gray-300 rounded w-full'></div> {/* desc line 1 */}
        <div className='h-3 bg-gray-300 rounded w-1/2'></div> {/* desc line 2 */}
      </div>
      <div className='flex justify-between px-3 mb-2 mt-2'>
        <div className='h-8 bg-gray-300 rounded w-16'></div> {/* button */}
        <div className='h-5 bg-gray-300 rounded w-20'></div> {/* price */}
      </div>
    </div>
  )
}

export default SkeletonCard