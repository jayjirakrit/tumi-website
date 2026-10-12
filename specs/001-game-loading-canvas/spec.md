# Feature Specification: Game Loading Drawing

**Feature Branch**: `001-game-loading-canvas`

**Created**: 2026-10-10

**Status**: Closed (2026-10-12), as built: board-scoped persistent guide, drawing starts after page load

**Input**: User description: "I want to analysis and planning to add canvas drawing when game page init loading. It will draw cinnamonroll as 2D with white and light blue as main color. refer to this image src\img\Cinnamoroll.png"

**Later decisions by the user**: The character is drawn inside the "Cinnamon Board" (the drawing area of the Game page) instead of on a full-screen loading screen; the drawing starts only once the page has fully finished loading; the finished character stays on the board as a guide that visitors can draw over.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Watch Cinnamoroll being drawn on the Cinnamon Board (Priority: P1)

A visitor opens the Game page. The page header, navigation and tool bar are shown as usual, and the Cinnamon Board is plain. Once the page and its content have fully finished loading, a friendly 2D Cinnamoroll (white rabbit-like character with long floppy ears and light-blue details, as in the reference image) is drawn on the board.

**Why this priority**: This is the whole feature: a branded, delightful moment on first entry to the Game page that also gives visitors a character to draw over.

**Independent Test**: Open the Game page from a fresh visit and confirm that after loading finishes the Cinnamoroll is drawn on the Cinnamon Board while the header, navigation and tool bar remain visible and usable.

**Acceptance Scenarios**:

1. **Given** a visitor who has just navigated to the Game page, **When** the page and its content are still loading, **Then** the Cinnamon Board is plain and the header, navigation and tool bar are visible and usable.
2. **Given** the page and its content have fully finished loading, **When** the drawing begins, **Then** a 2D Cinnamoroll is drawn inside the Cinnamon Board, using white and light blue as its main colors.
3. **Given** the reference image of Cinnamoroll, **When** a stakeholder compares it with the finished drawing, **Then** the character is clearly recognisable (long floppy ears, round face, eyes, small mouth).
4. **Given** the drawing is complete, **When** the visitor keeps viewing the Game page, **Then** Cinnamoroll stays on the board and does not fade or disappear.

---

### User Story 2 - Draw freehand over Cinnamoroll (Priority: P1)

The finished Cinnamoroll stays on the board as a guide. The visitor can immediately draw freehand on top of it, and can clear their own drawing without losing the character.

**Why this priority**: The drawing is only useful if the game stays fully playable; keeping the character as a guide is the user's key decision.

**Independent Test**: After the figure is drawn, draw several strokes over it, press Clear, and confirm only those strokes vanish.

**Acceptance Scenarios**:

1. **Given** Cinnamoroll is drawn on the board, **When** the visitor draws freehand, **Then** their strokes appear on top of the character.
2. **Given** the visitor has drawn their own strokes over Cinnamoroll, **When** they press the Clear button, **Then** only the visitor's strokes are removed and Cinnamoroll remains.
3. **Given** the board holds only Cinnamoroll, **When** the visitor presses Clear, **Then** Cinnamoroll remains unchanged.

---

### User Story 3 - Drawing is presented as an animated drawing (Priority: P2)

The visitor sees the character built up progressively, stroke by stroke, as if someone were sketching it live.

**Why this priority**: Adds delight, but the feature still has value if the drawing is shown at once.

**Independent Test**: Reload the Game page and observe whether the character visibly builds up on the board after loading finishes.

**Acceptance Scenarios**:

1. **Given** the page has fully loaded, **When** the visitor watches the board, **Then** the character is drawn stroke by stroke until the full figure is visible, within a few seconds.
2. **Given** the page takes unusually long to load, **When** loading finally ends or the wait limit is reached, **Then** the finished figure appears at once instead of waiting or blocking the page.

---

### User Story 4 - Works well on phones and for all visitors (Priority: P3)

The drawing fits the board on any screen size, especially phones, stays centred and in proportion, and respects visitors who prefer reduced motion.

**Why this priority**: Most visitors use phones, and the feature must not harm performance or accessibility.

**Independent Test**: View the Game page at phone and desktop widths, and with reduced-motion preference enabled.

**Acceptance Scenarios**:

1. **Given** a phone-sized screen, **When** the character is drawn, **Then** the full character is visible within the board, centred, and not cut off.
2. **Given** a desktop-sized screen, **When** the character is drawn, **Then** it is centred and sized proportionally, not stretched or blurry.
3. **Given** a visitor who prefers reduced motion, **When** the page has loaded, **Then** the finished character is shown at once with no drawing animation.

---

### Edge Cases

- The page loads almost instantly: the drawing still starts only after loading is complete and plays normally on the board; the game is usable throughout.
- The page takes unusually long to load: the finished figure appears at once rather than leaving the board empty or blocking the visitor.
- The visitor starts drawing while the character is still being drawn: the game remains usable and the visitor's strokes are kept.
- The visitor presses Clear repeatedly or with no strokes drawn: Cinnamoroll is never removed.
- The visitor revisits the Game page in the same session: the drawing behaves the same as on the first visit.
- The visitor resizes the window or rotates the phone: the character stays whole, centred and proportionate within the board, and the visitor's strokes are kept.
- The drawing cannot be shown for any reason: the board and the whole game remain fully usable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a 2D drawing of Cinnamoroll inside the Cinnamon Board of the Game page, not as a full-screen or separate loading screen.
- **FR-002**: The drawing MUST use white and light blue as its main colors.
- **FR-003**: The drawing MUST be recognisable as the character in the reference image (round face, long floppy ears, eyes, small mouth). Subtle brown outline and pink cheek accents from the reference MUST be kept, while white and light blue remain clearly dominant.
- **FR-004**: The system MUST begin drawing the character only after the Game page and its content have fully finished loading; until then the Cinnamon Board is plain.
- **FR-005**: The system MUST draw the character progressively, stroke by stroke, completing the full figure within a few seconds of starting.
- **FR-006**: Once drawn, Cinnamoroll MUST stay on the board as a guide and MUST NOT fade, disappear or be replaced.
- **FR-007**: The visitor MUST be able to draw freehand on top of Cinnamoroll, with their strokes appearing above the character.
- **FR-008**: The Clear button MUST remove only the visitor's own strokes and MUST NOT remove Cinnamoroll.
- **FR-009**: The page header, navigation and tool bar MUST remain visible and usable at all times, before, during and after the drawing.
- **FR-010**: The drawing MUST be fully visible, centred and proportionate within the board on phone and desktop screen sizes, and MUST adapt if the screen size or orientation changes.
- **FR-011**: The drawing MUST NOT noticeably delay the moment the game becomes available, and MUST NOT block the visitor from using the board while it is being drawn.
- **FR-012**: If the drawing cannot be shown, the game MUST remain fully usable.
- **FR-013**: If the page takes unusually long to load, the system MUST show the finished figure at once rather than waiting or blocking.
- **FR-014**: For visitors who have indicated a preference for reduced motion, the system MUST show the finished figure at once without the stroke-by-stroke animation.
- **FR-015**: The drawing MUST appear only on the Game page's Cinnamon Board and MUST NOT alter other pages.

### Key Entities

- **Cinnamon Board**: The drawing area of the Game page where visitors draw freehand; it also hosts Cinnamoroll.
- **Cinnamoroll Guide Drawing**: The 2D Cinnamoroll picture shown on the board; defined by its character likeness, its main colors (white, light blue) and its accents. It persists once drawn and is separate from the visitor's strokes.
- **Visitor Strokes**: The freehand lines the visitor draws on the board; these are what Clear removes.
- **Reference Image**: The provided Cinnamoroll picture that defines how the character should look.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of test runs, the Cinnamon Board is usable at once on arrival (header, navigation, tool bar and freehand drawing all work) and is never covered by a loading screen.
- **SC-002**: In a review, at least 9 of 10 stakeholders identify the drawing as Cinnamoroll when compared with the reference image.
- **SC-003**: After the page has fully loaded, the drawing finishes within 5 seconds in normal conditions; when loading is unusually slow, the finished figure is shown at once.
- **SC-004**: The full character is visible within the board without cropping on screen widths from 320 px to 1920 px.
- **SC-005**: In 100% of test runs, pressing Clear removes all of the visitor's strokes and leaves Cinnamoroll in place.
- **SC-006**: The game is fully usable in 100% of test runs, including when the drawing cannot be shown.

## Assumptions

- The drawing appears only when entering the Game page, not for other pages or for in-game actions.
- "2D" means a flat, illustrated style (no depth or 3D effects).
- The drawing is an original simplified illustration inspired by the reference image, not a copy of the image file itself.
- Visitors mainly use phones, so phone display is the primary design target.
- The Cinnamon Board, the tool bar and the game's existing behaviour are unchanged except that the board now holds the Cinnamoroll guide and Clear leaves it in place.
- "Unusually long to load" means a wait of several seconds beyond normal; the exact limit is a design detail.
- Visitors who start drawing before the figure is complete keep their strokes; the character is simply drawn beneath them.
- The drawing is lightweight and does not require extra downloads that slow the page.
- No sound, text, or progress percentage accompanies the drawing unless requested later.
- Character likeness is used for the owner's personal website in a non-commercial context.
