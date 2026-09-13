// The differentiated part of the page — the actual founding pattern, not a
// generic origin story (brief: "the one story only this business can tell").
export function StorySection() {
  return (
    <section id="the-story" className="bg-offwhite" aria-labelledby="story-heading">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 id="story-heading" className="text-3xl">
          Why The Modern CoS exists
        </h2>
        <p className="text-muted mt-6 text-lg">
          Before this was a company, it was a pattern Tina kept seeing.
        </p>
        <p className="text-muted mt-4 text-lg">
          Working directly with small business owners as a contractor, the same problem surfaced
          over and over. Different clients, different industries, different tools. But the same
          underlying ask: someone needed to build the workflow and automation support that a few
          hours of virtual assistant time couldn&apos;t cover. Not more hands. Better systems.
        </p>
        <p className="text-muted mt-4 text-lg">
          That repetition became the thesis. Founders don&apos;t usually need another task done.
          They need the operation itself rebuilt so the task doesn&apos;t have to keep happening
          manually.
        </p>
      </div>
    </section>
  );
}
