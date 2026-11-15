package story

// Scene and State describe where a screenplay scene starts and ends, so
// consecutive scenes keep characters and props continuous.
type Scene struct {
	Layout   string `json:"layout"`
	Axis     string `json:"axis"`
	Lighting string `json:"lighting"`
}
type CharacterState struct {
	CharacterID string `json:"character_id"`
	Position    string `json:"position"`
	Pose        string `json:"pose"`
	Facing      string `json:"facing"`
	LookAt      string `json:"look_at"`
}
type PropState struct {
	PropID   string `json:"prop_id"`
	OwnerID  string `json:"owner_id"`
	Hand     string `json:"hand"`
	Position string `json:"position"`
	Contact  string `json:"contact"`
}
type State struct {
	Characters []CharacterState `json:"characters"`
	Props      []PropState      `json:"props"`
}
