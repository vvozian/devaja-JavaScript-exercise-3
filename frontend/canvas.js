function create_matrix(matrixCode, isInteractive, interactionHandler) {
    // Config
    const CELL_SIZE = 20;
    const CELL_SPACING = 2;
    const CANVAS_PADDING = 2;
    const CELL_COLOR_BASE = '#22272e';
    const CELL_COLOR_ACTIVE = '#ffa701';
    const CANVAS_BACKGROUND = '#1c2128';
    const CELLS_IN_ROW = 8;
    const CELLS_IN_COLUMN = 8;
    let ZOOM = 1;

    // Creating matrix from binar code
    function generate_matrix(matrixCode) {
        let matrix = [];
        let row = [];

        // Filling matrix with disabled pixels
        for (let j = 0; j < CELLS_IN_ROW; j++) {
            row.push(false)
        }
        for (let i = 0; i < CELLS_IN_COLUMN; i++) {
            matrix.push(row.slice())
        }

        // In case matrixCode was passed to function, filling cells 
        // with according pixel states
        if (matrixCode) {
            for (let y = 0; y < CELLS_IN_COLUMN; y++) {
                for (let x = 0; x < CELLS_IN_ROW; x++) {
                    matrix[y][x] = Boolean(parseInt(matrixCode[x + y * CELLS_IN_COLUMN]));
                }
            }
        }

        return matrix
    }

    // Calculating canvas size from config params
    function get_canvas_size() {
        const w = CELL_SIZE * CELLS_IN_ROW + (CELLS_IN_ROW - 1) * CELL_SPACING + 2 * CANVAS_PADDING;
        const y = CELL_SIZE * CELLS_IN_COLUMN + (CELLS_IN_COLUMN - 1) * CELL_SPACING + 2 * CANVAS_PADDING;

        return { w: w * ZOOM, h: y * ZOOM };
    }

    // Finding optimal canvas size relative to screen
    function get_optimal_zoom() {
        const current_size = get_canvas_size()
        const kWidth = ZOOM * window.screen.width / current_size.w;
        const kHeight = ZOOM * window.screen.height / current_size.h;
        
        return Math.min(kWidth, kHeight);
    }

    // Handler for click on canvas
    function canvas_click_handler(event, matrix, interactionHandler) {
        // Defining clicked cell
        const canvasBounding = canvas.getBoundingClientRect();

        let x = event.offsetX;
        let y = event.offsetY;

        const canvasSize = get_canvas_size();
        const xK = canvasSize.w/canvasBounding.width;
        const yK = canvasSize.h/canvasBounding.height;

        x *= xK;
        y *= yK;

        x -= CANVAS_PADDING * ZOOM;
        y -= CANVAS_PADDING * ZOOM;
        


        let clickedCell = {x: null, y: null}

        if (0 <= x <= canvasSize.w && 0 <= y <= canvasSize.h) {
            const xIndex = parseInt(x / ((CELL_SIZE + CELL_SPACING) * ZOOM));
            const yIndex = parseInt(y / ((CELL_SIZE + CELL_SPACING) * ZOOM));

            const xDelta = (xIndex + 1) * (CELL_SIZE + CELL_SPACING) * ZOOM - x;
            const yDelta = (yIndex + 1) * (CELL_SIZE + CELL_SPACING) * ZOOM - y;

            if (CELL_SPACING * ZOOM <= xDelta && xDelta <= CELL_SIZE * ZOOM + CELL_SPACING * ZOOM && CELL_SPACING * ZOOM <= yDelta && yDelta <= CELL_SIZE * ZOOM + CELL_SPACING * ZOOM) {
                clickedCell = {x: xIndex, y: yIndex}
                matrix[yIndex][xIndex] = !matrix[yIndex][xIndex]
            }
        }
        
        // Executing additional handler
        interactionHandler(matrix, clickedCell);
        
        return matrix
    }

    // Rendering canvas
    function render(canvas, matrix) {
        const context = canvas.getContext('2d');

        const canvasSize = get_canvas_size();
    
        canvas.width = canvasSize.w;
        canvas.height = canvasSize.h;
    
        context.fillStyle = CANVAS_BACKGROUND;
        context.fillRect(0, 0, canvasSize.w, canvasSize.h);
    
        for (let y = 0; y < CELLS_IN_COLUMN; y++) {
            for (let x = 0; x < CELLS_IN_ROW; x++) {
                if (matrix[y][x]) {
                    context.fillStyle = CELL_COLOR_ACTIVE
                }
                else {
                    context.fillStyle = CELL_COLOR_BASE
                }
                context.beginPath()
                context.rect(
                    ((CELL_SIZE + CELL_SPACING) * (x) + CANVAS_PADDING) * ZOOM,
                    ((CELL_SIZE + CELL_SPACING) * (y) + CANVAS_PADDING) * ZOOM,
                    CELL_SIZE * ZOOM,
                    CELL_SIZE * ZOOM
                )
                context.fill();
            }
        }
    }

    // Setting optimal zoom to config
    ZOOM = get_optimal_zoom()

    // Initializing matrix
    let matrix = generate_matrix(matrixCode);

    // Creating canvas DOM
    const canvas = document.createElement('canvas');

    // In case the cavas interactive, apply click handler;
    if (isInteractive) {
        canvas.onclick = (e) => {
            matrix = canvas_click_handler(e, matrix, interactionHandler);
            render(canvas, matrix);
        }

    }

    // Initial rendering
    render(canvas, matrix)

    return canvas
}