export function emptyPreferences() {
  return {
    genre: "",
    style: "",
    style_instructions: "",
    pov: "",
    mode: "",
    chapter_words: 0,
    planned_chapters: 0,
  };
}

export function completeOutline(text = "大纲") {
  return {
    overview: text,
    world: text,
    characters: text
      ? [{ id: "outline-actor", name: "人物", description: "动机与关系" }]
      : [],
    locations: text
      ? [{ id: "outline-place", name: "场景", description: "稳定环境" }]
      : [],
    props: [],
  };
}
