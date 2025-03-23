# LLM Model Comparison

Compare different open-source LLM models using ollama as backend to run the model.

To execute the script, run
```sh
deno task start
```

## Experiments
Experiments are defined in the `experiments` folder. Each experiment is a YAML file with the following fields:
- `models`: List of models to compare
- `stylePrompts`: A list of prompts to specify the style used by the LLM to generate text
- `llmPrompt`: Prompt to specify the text to generate

Each experiment should have a unique name that represents what the experiment is about.

An example of an experiment file named `rewrite-bullet-points-to-text.yaml`:
```yaml
models:
- deepseek-r1
- gemma3:12b
- llama3.2
- mistral
- phi4
stylePrompts: 
- name: original
  prompt: |
    Use clear, direct language and avoid complex terminology.
    Aim for a Flesch reading score of 80 or higher.
    Use the active voice.
    Avoid adverbs.
    Avoid buzzwords and instead use plain English.
    Use jargon where relevant.
    Avoid being salesy or overly enthusiastic and instead express calm confidence.
    Prefer full sentences over bullet points unless explicitly requested.
- name: avoid-we-and-dashes
  prompt: |
    Use clear, direct language and avoid complex terminology.
    Aim for a Flesch reading score of 80 or higher.
    Use the active voice.
    Avoid adverbs.
    Avoid buzzwords and instead use plain English.
    Use jargon where relevant.
    Avoid being salesy or overly enthusiastic and instead express calm confidence.
    Prefer full sentences over bullet points unless explicitly requested.
    Avoid overusing "we".
    Don't use dashes or semicolons.

llmPrompt: |
  The context is a software system that uses available data to determine the code quality of a codebase.
  Rewrite the following section into paragraphs without bullet points that could be used in an article about the topic.

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
```
