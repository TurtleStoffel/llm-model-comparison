import { parse } from "jsr:@std/yaml"

const experimentName = "rewrite-bullet-points-to-text"

const experiment = await Deno.readTextFile(`./experiments/${experimentName}.yaml`)

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

const experimentStartTimestamp = Temporal.Now.instant().epochMilliseconds
const responsePromises = parsedExperiment.models.flatMap(model => {
  return parsedExperiment.stylePrompts.map(async stylePrompt => {
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

    return {
      model,
      stylePromptName: stylePrompt.name,
      response: parsedContent.response
    }
  })
})

const responses = await Promise.all(responsePromises)

const outputFolder = `./output/${experimentName}-${experimentStartTimestamp}`
Deno.mkdir(outputFolder, { recursive: true });

responses.forEach(async response => {
    const filename = `${response.model}-${response.stylePromptName}.txt`

    await Deno.writeTextFile(`${outputFolder}/${filename}`, response.response);
})

const markdownResult = responses.map(response => {
  return `## ${response.model} - ${response.stylePromptName}\n${response.response}`
})

await Deno.writeTextFile(`${outputFolder}/${experimentName}.md`, markdownResult.join("\n\n"))
