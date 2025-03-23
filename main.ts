const models = ["deepseek-r1"]

const stylePrompt = `
Use clear, direct language and avoid complex terminology.
Aim for a Flesch reading score of 80 or higher.
Use the active voice.
Avoid adverbs.
Avoid buzzwords and instead use plain English.
Use jargon where relevant.
Avoid being salesy or overly enthusiastic and instead express calm confidence.

Avoid using bullet points, instead write out information in full sentences.
`

const llmPrompt = `
Rewrite the following section with bullet points into normal text.

## Concept
Rely as little as possible on gathering manual data from engineering, but rather on other metrics that can easily be calculated from existing systems:
- Runtime data
	- How often are lines executed
	- How often are certain branches taken
	- This can be based on automated tests too, although it's not 100% representative
- Version Control data
	- Code hotspots (= how often are certain files updated)
		- Code hotspots + code coverage by automated tests
	- How much do tests have to change as a result of a code change (a lot of changing tests is usually a bad sign)
	- Unchanged code (good code doesn't have to change because it works, bad code usually isn't changed because nobody dares to touch it)
`

models.forEach(async model => {
  let resp = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({ 
      model,
      prompt: stylePrompt + llmPrompt,
      stream: false,
    }),
  });

  console.log(resp.status); // 200
  console.log(resp.headers.get("Content-Type")); // "text/html"
  const content = await resp.text();
  console.log(content); // "Hello, World!"

  const parsedContent = JSON.parse(content)

  await Deno.writeTextFile(`./output/test.txt`, parsedContent.response, { encoding: "utf8" });
})