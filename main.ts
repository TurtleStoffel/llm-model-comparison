import { parse } from "jsr:@std/yaml"

const experimentName = "rewrite-bullet-points-to-text"

const experiment = await Deno.readTextFile(`./experiments/${experimentName}.yaml`)

interface Experiment {
  models: string[]
  stylePrompt: string
  llmPrompt: string
}

const parsedExperiment = parse(experiment) as Experiment

const experimentStartTimestamp = Temporal.Now.instant().epochMilliseconds
parsedExperiment.models.forEach(async model => {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({ 
      model,
      prompt: parsedExperiment.stylePrompt + parsedExperiment.llmPrompt,
      stream: false,
    }),
  });

  console.log(response.status);
  console.log(response.headers.get("Content-Type")); 
  const content = await response.text();
  console.log(content); // "Hello, World!"

  const parsedContent = JSON.parse(content)

  const outputFolder = `./output/${experimentName}-${experimentStartTimestamp}`
  Deno.mkdir(outputFolder, { recursive: true });

  await Deno.writeTextFile(`${outputFolder}/${model}.txt`, parsedContent.response);
})