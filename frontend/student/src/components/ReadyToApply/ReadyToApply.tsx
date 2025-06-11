import { Button } from "@radix-ui/themes"

const ReadyToApply = () => {
  return (
    <div className="flex flex-col items-center gap-4 mb-8 sm:mb-6 md:mb-8 lg:mb-10 bg-black p-4 sm:py-6 md:py-8 lg:py-10">
      <h1 className="!text-white">Ready to Start Your Journey?</h1>
      <Button className="button-secondary !py-6 !my-14 sm:!my-10 !w-fit">Create My Profile</Button>
    </div>
  )
}

export default ReadyToApply