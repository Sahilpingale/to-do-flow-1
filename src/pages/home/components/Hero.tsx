import { FlipWords } from "@/components/ui/flip-words"

export const Hero = () => {
  return (
    <section className="w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      {/* Flip words */}
      <div className="h-48 w-full flex justify-center items-center px-2 sm:px-4">
        <div className="text-2xl sm:text-3xl md:text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 w-full max-w-fit md:max-w-md">
          Manage tasks
          <FlipWords
            words={["effortlessly", "efficiently", "seamlessly"]}
          />{" "}
          <br />
          <span>with </span>
          <span className="bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent font-bold">
            To Do Flow
          </span>
        </div>
      </div>
    </section>
  )
}
