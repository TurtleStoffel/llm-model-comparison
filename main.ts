import { parse } from "jsr:@std/yaml"

const experimentName = "rewrite-bullet-points-to-text"
const experiment = await Deno.readTextFile(`./experiments/${experimentName}.yaml`)
const experimentStartTimestamp = Temporal.Now.instant().epochMilliseconds

const outputFolder = `./output/${experimentName}-${experimentStartTimestamp}`
Deno.mkdir(outputFolder, { recursive: true });

interface StylePrompt {
  name: string
  prompt: string
}

interface Experiment {
  models: string[]
  stylePrompts: StylePrompt[]
  llmPrompt: string
}

const parsedExperiment = parse(experiment) as Experiment

parsedExperiment.models.forEach(model => {
  parsedExperiment.stylePrompts.forEach(async stylePrompt => {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({ 
        model,
        prompt: stylePrompt.prompt + parsedExperiment.llmPrompt,
        stream: false,
      }),
    });

    console.log(response.status);
    console.log(response.headers.get("Content-Type")); 
    const content = await response.text();
    console.log(content);

    const parsedContent = JSON.parse(content)

    // Write model-specific output file
    const filename = `${model}-${stylePrompt.name}.txt`
    await Deno.writeTextFile(`${outputFolder}/${filename}`, parsedContent.response);

    // Append aggregated Markdown file
    const markdownResult = `## ${model} - ${stylePrompt.name}\n${parsedContent.response}\n`
    await Deno.writeTextFile(`${outputFolder}/${experimentName}.md`, markdownResult, { append: true })
  })
})
