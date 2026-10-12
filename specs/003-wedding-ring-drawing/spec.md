# Feature Specification: Wedding Ring Drawing

**Feature Branch**: `003-wedding-ring-drawing`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "I want to add marry ring drawing in game page beside cinnamonroll drawing at the same time. using canvas 2D and same pattern."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See a wedding ring drawn beside Cinnamoroll (Priority: P1)

A visitor opens the Game page. Once the page has fully loaded, the Cinnamon Board shows the Cinnamoroll drawing and, next to it, a 2D wedding ring. Both are drawn during the same moment, so the visitor watches them appear together, and both are visible side by side when finished.

**Why this priority**: This is the whole feature: a second drawing that sits beside Cinnamoroll and is drawn at the same time.

**Independent Test**: Open the Game page from a fresh visit and confirm that, after loading finishes, a wedding ring and Cinnamoroll are drawn side by side on the board, both fully visible.

**Acceptance Scenarios**:

1. **Given** the page and its content are still loading, **When** the visitor looks at the board, **Then** the board is plain and the header, navigation and tool bar are visible and usable.
2. **Given** the page has fully finished loading, **When** the drawing begins, **Then** Cinnamoroll and a wedding ring start being drawn at the same time, with the ring placed beside Cinnamoroll.
3. **Given** both drawings are complete, **When** the visitor keeps viewing the page, **Then** both remain on the board, side by side, without fading or disappearing.
4. **Given** the finished ring, **When** a stakeholder looks at it, **Then** it is clearly recognisable as a wedding ring (a round white/silver metal band with a sparkling diamond set on top).

---

### User Story 2 - Draw freehand over both drawings (Priority: P1)

Both drawings stay on the board as guides. The visitor can draw freehand over either of them and clear their own strokes without losing the ring or Cinnamoroll.

**Why this priority**: The game must stay fully playable and behave as it already does for Cinnamoroll.

**Independent Test**: Draw strokes over both the ring and Cinnamoroll, press Clear, and confirm only the visitor's strokes vanish.

**Acceptance Scenarios**:

1. **Given** both drawings are on the board, **When** the visitor draws freehand over either one, **Then** their strokes appear on top of it.
2. **Given** the visitor has drawn strokes, **When** they press Clear, **Then** only their strokes are removed and both the ring and Cinnamoroll remain.
3. **Given** the board holds only the two drawings, **When** the visitor presses Clear, **Then** both remain unchanged.

---

### User Story 3 - Same animated drawing style as Cinnamoroll (Priority: P2)

The ring is built up progressively, stroke by stroke, in the same manner and at the same pace as Cinnamoroll, so the two feel like one scene.

**Why this priority**: Consistency adds polish, but the feature still has value if the ring appears at once.

**Independent Test**: Reload the Game page and observe that both drawings build up together and finish at about the same time.

**Acceptance Scenarios**:

1. **Given** the page has fully loaded, **When** the visitor watches the board, **Then** both drawings are completed stroke by stroke within a few seconds.
2. **Given** the page takes unusually long to load, **When** loading ends or the wait limit is reached, **Then** both finished drawings appear at once.
3. **Given** a visitor who prefers reduced motion, **When** the page has loaded, **Then** both finished drawings are shown at once with no animation.

---

### User Story 4 - Both drawings fit on phones and desktops (Priority: P3)

On any screen size, both drawings are fully visible, in proportion, and arranged side by side without overlapping each other.

**Why this priority**: Most visitors use phones, so the second drawing must not push anything off the board.

**Independent Test**: View the Game page at phone and desktop widths and rotate the phone.

**Acceptance Scenarios**:

1. **Given** a phone-sized screen, **When** the drawings are shown, **Then** both are fully visible within the board, not cut off and not overlapping.
2. **Given** a desktop-sized screen, **When** the drawings are shown, **Then** they are balanced across the board, in proportion and not stretched or blurry.
3. **Given** the window is resized or the phone is rotated, **When** the board changes size, **Then** both drawings stay whole and side by side, and the visitor's strokes are kept.

---

### Edge Cases

- The page loads almost instantly: both drawings still begin only after loading is complete and play normally.
- The page takes unusually long to load: both finished drawings appear at once rather than leaving the board empty.
- The visitor starts drawing while the drawings are still being made: strokes are kept and the drawings are placed beneath them.
- The visitor presses Clear repeatedly or with no strokes: neither drawing is ever removed.
- Only one of the two drawings can be shown for any reason: the other still appears and the whole game stays usable.
- A very narrow screen leaves little room: both drawings are scaled down together rather than one being hidden or cropped.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a 2D wedding ring drawing on the Cinnamon Board of the Game page, positioned beside the Cinnamoroll drawing.
- **FR-002**: The ring MUST be recognisable as a wedding ring: a round white or silver metal band with a sparkling diamond set on top.
- **FR-003**: The ring's colors MUST harmonise with Cinnamoroll's palette (white and light blue dominant), with the metal band in white or silver (no gold) and the diamond showing light-blue and white sparkle highlights.
- **FR-004**: The ring and Cinnamoroll MUST be drawn at the same time, starting only after the Game page and its content have fully finished loading; until then the board is plain.
- **FR-005**: The ring MUST be drawn progressively, stroke by stroke, in the same style as Cinnamoroll, and both drawings MUST finish within a few seconds of starting.
- **FR-006**: Once drawn, the ring MUST stay on the board as a guide and MUST NOT fade, disappear or be replaced.
- **FR-007**: The visitor MUST be able to draw freehand over the ring and over Cinnamoroll, with their strokes appearing above both.
- **FR-008**: The Clear button MUST remove only the visitor's own strokes and MUST NOT remove the ring or Cinnamoroll.
- **FR-009**: The header, navigation and tool bar MUST remain visible and usable at all times.
- **FR-010**: Both drawings MUST be fully visible, in proportion, side by side and non-overlapping on phone and desktop screens, and MUST adapt when the screen size or orientation changes.
- **FR-011**: Adding the ring MUST NOT change how Cinnamoroll looks or behaves and MUST NOT noticeably delay the moment the game becomes available.
- **FR-012**: If the ring cannot be shown, Cinnamoroll and the game MUST remain fully usable, and vice versa.
- **FR-013**: If the page takes unusually long to load, both finished drawings MUST appear at once.
- **FR-014**: For visitors who prefer reduced motion, both finished drawings MUST appear at once without animation.
- **FR-015**: The ring MUST appear only on the Game page's Cinnamon Board and MUST NOT alter other pages.

### Key Entities

- **Cinnamon Board**: The drawing area of the Game page; it now hosts two guide drawings and the visitor's strokes.
- **Wedding Ring Guide Drawing**: The 2D wedding ring shown beside Cinnamoroll; it persists once drawn and is separate from the visitor's strokes.
- **Cinnamoroll Guide Drawing**: The existing 2D character, unchanged.
- **Visitor Strokes**: The freehand lines the visitor draws; these are what Clear removes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of test runs, after the page finishes loading, both the ring and Cinnamoroll are visible on the board at the same time, side by side.
- **SC-002**: In a review, at least 9 of 10 stakeholders identify the ring as a wedding ring.
- **SC-003**: Both drawings start together and finish within 5 seconds of starting in normal conditions.
- **SC-004**: Both drawings are fully visible, uncropped and non-overlapping on screen widths from 320 px to 1920 px.
- **SC-005**: In 100% of test runs, pressing Clear removes all of the visitor's strokes and leaves both drawings in place.
- **SC-006**: The game is fully usable in 100% of test runs, including when one or both drawings cannot be shown.

## Assumptions

- "Marry ring" means a diamond wedding ring; it is drawn as a single ring (a round white/silver metal band with a diamond set on top), not a pair of rings.
- "Beside" means left-right on one board: the ring on the left of Cinnamoroll, sitting slightly higher than her (near her left side), with Cinnamoroll to its right; the ring is drawn smaller than Cinnamoroll (revised after review: Cinnamoroll is the main figure, the ring about two-thirds of her width). This holds on phones as well as desktop (both scaled down together on narrow screens).
- "The same pattern" means the behaviour of the existing Cinnamoroll drawing: starts after page load, stroke-by-stroke animation, persists as a guide, visitors draw over it, Clear leaves it, instant display for slow loads and reduced motion.
- The ring is an original simplified flat illustration; its colors suit the existing white and light-blue theme with a white or silver metal band and a sparkling diamond.
- Visitors mainly use phones, so phone display is the primary design target.
- The tool bar and existing game behaviour are otherwise unchanged.
- No sound, text or labels accompany the ring.
