import { parse } from "jsr:@std/yaml"

const experiment = await Deno.readTextFile("./experiments/rewrite-bullet-points-to-text.yaml")

interface Experiment {
  models: string[]
  stylePrompt: string
  llmPrompt: string
}

const parsedExperiment = parse(experiment) as Experiment

parsedExperiment.models.forEach(async model => {
  let resp = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    body: JSON.stringify({ 
      model,
      prompt: parsedExperiment.stylePrompt + parsedExperiment.llmPrompt,
      stream: false,
    }),
  });

  console.log(resp.status); // 200
  console.log(resp.headers.get("Content-Type")); // "text/html"
  const content = await resp.text();
  console.log(content); // "Hello, World!"

  const parsedContent = JSON.parse(content)

  await Deno.writeTextFile(`./output/test-${model}.txt`, parsedContent.response, { encoding: "utf8" });
})