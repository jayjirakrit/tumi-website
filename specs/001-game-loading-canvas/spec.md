# Feature Specification: Game Loading Drawing

**Feature Branch**: `001-game-loading-canvas`

**Created**: 2026-10-10

**Status**: Draft

**Input**: User description: "I want to analysis and planning to add canvas drawing when game page init loading. It will draw cinnamonroll as 2D with white and light blue as main color. refer to this image src\img\Cinnamoroll.png"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Watch Cinnamoroll appear while the Game page loads (Priority: P1)

A visitor opens the Game page. Instead of a blank or empty screen while the page prepares itself, they see a friendly 2D Cinnamoroll (white rabbit-like character with long floppy ears and light-blue details, as in the reference image) being drawn. When the page is ready, the visitor moves on to the game.

**Why this priority**: This is the whole feature: a branded, delightful loading moment that replaces dead time on first entry to the Game page.

**Independent Test**: Open the Game page from a fresh visit and confirm the Cinnamoroll drawing is visible during loading and gives way to the playable game when loading ends.

**Acceptance Scenarios**:

1. **Given** a visitor who has just navigated to the Game page, **When** the page begins loading, **Then** a 2D Cinnamoroll drawing is shown in the loading area, using white and light blue as its main colors.
2. **Given** the loading drawing is showing, **When** the Game page finishes loading, **Then** the loading drawing is replaced by the game and the visitor can start playing.
3. **Given** the reference image of Cinnamoroll, **When** a stakeholder compares it with the loading drawing, **Then** the character is clearly recognisable (long floppy ears, round face, eyes, small mouth).

---

### User Story 2 - Drawing is presented as an animated drawing (Priority: P2)

The visitor sees the character being drawn progressively, stroke by stroke, as if someone were sketching it live.

**Why this priority**: Adds delight and signals that progress is happening, but the feature still has value if the drawing is static.

**Independent Test**: Reload the Game page and observe whether the character visibly builds up during loading.

**Acceptance Scenarios**:

1. **Given** the loading screen is shown, **When** the visitor watches it, **Then** the character is drawn stroke by stroke until the full figure is visible.
2. **Given** the Game page is ready in under 1 second, **When** the loading drawing is showing, **Then** it stays on screen for a minimum of about 1 to 2 seconds so the drawing always completes before the game appears.

---

### User Story 3 - Works well on phones and for all visitors (Priority: P3)

The loading drawing fits any screen size, especially phones, stays centred and in proportion, and does not make loading feel slower or block visitors who prefer reduced motion.

**Why this priority**: Most visitors use phones, and loading feedback must not harm performance or accessibility.

**Independent Test**: View the Game page loading at phone and desktop widths, and with reduced-motion preference enabled.

**Acceptance Scenarios**:

1. **Given** a phone-sized screen, **When** the Game page loads, **Then** the full character is visible, centred, and not cut off or overflowing.
2. **Given** a desktop-sized screen, **When** the Game page loads, **Then** the character is centred and sized proportionally, not stretched or blurry.
3. **Given** a visitor who prefers reduced motion, **When** the Game page loads, **Then** the character is shown without distracting movement.

---

### Edge Cases

- Loading finishes almost instantly: the drawing still completes during the minimum display time, so no flicker of a partly drawn character is seen.
- Loading takes unusually long: the drawing remains in a calm, finished state (it does not repeat awkwardly or look frozen mid-stroke).
- Visitor revisits the Game page in the same session: the loading drawing behaves the same way as on the first visit unless the page loads instantly.
- Visitor resizes the window or rotates the phone during loading: the drawing adjusts and stays whole and centred.
- The loading drawing fails to appear for any reason: the visitor still reaches the game without being blocked.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a 2D drawing of Cinnamoroll in the Game page's loading area whenever the Game page is loading on entry.
- **FR-002**: The drawing MUST use white and light blue as its main colors.
- **FR-003**: The drawing MUST be recognisable as the character in the reference image (round face, long floppy ears, eyes, small mouth). Subtle brown outline and pink cheek accents from the reference MUST be kept, while white and light blue remain clearly dominant.
- **FR-004**: The system MUST replace the loading drawing with the game once the Game page is ready and the drawing has completed, without requiring any action from the visitor.
- **FR-010**: The system MUST draw the character progressively, stroke by stroke, until the full figure is visible.
- **FR-011**: The loading drawing MUST remain visible for a minimum of about 1 to 2 seconds so the drawing always completes, even if the page is ready sooner.
- **FR-005**: The drawing MUST be fully visible, centred and proportionate on phone and desktop screen sizes, and MUST adapt if the screen size or orientation changes.
- **FR-006**: The loading drawing MUST NOT noticeably delay the moment the game becomes available.
- **FR-007**: The loading drawing MUST NOT block the visitor from reaching the game if the drawing itself cannot be shown.
- **FR-008**: The system MUST present the drawing without strong movement for visitors who have indicated a preference for reduced motion.
- **FR-009**: The loading drawing MUST be shown only on the Game page and MUST NOT alter other pages.

### Key Entities

- **Loading Drawing**: The 2D Cinnamoroll picture shown during Game page loading; defined by its character likeness, its main colors (white, light blue) and its accents.
- **Reference Image**: The provided Cinnamoroll picture that defines how the character should look.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a first visit, 100% of Game page loads show the Cinnamoroll drawing (or the game directly, if loading is instant) rather than a blank screen.
- **SC-002**: In a review, at least 9 of 10 stakeholders identify the drawing as Cinnamoroll when compared with the reference image.
- **SC-003**: The game becomes available no later than 2 seconds after entering the Game page when loading is fast, and no later than 0.5 seconds after the page is ready when loading is slow.
- **SC-004**: The full character is visible without cropping or scrolling on screen widths from 320 px to 1920 px.
- **SC-005**: Visitors reach the playable game without any manual action in 100% of test runs, including when the drawing cannot be shown.

## Assumptions

- The loading drawing appears only when entering the Game page, not for other pages or for in-game actions.
- "2D" means a flat, illustrated style (no depth or 3D effects).
- The drawing is an original simplified illustration inspired by the reference image, not a copy of the image file itself.
- Visitors mainly use phones, so phone display is the primary design target.
- The existing game and its drawing board are unchanged by this feature.
- The deliberate 1 to 2 second minimum display is an accepted trade-off for a complete, pleasant drawing.
- For reduced-motion visitors, the finished character is shown without the stroke-by-stroke animation.
- The drawing is lightweight and does not require extra downloads that slow the page.
- No sound, text, or progress percentage accompanies the drawing unless requested later.
- Character likeness is used for the owner's personal website in a non-commercial context.
