import React, { useEffect } from "react";
import QRCode from "qrcode";
import { getTableLink } from "@/lib/utils";

interface IQRCodeTableProps {
	token: string;
	tableNumber: number;
	width?: number;
}
const QRCodeTable = (props: IQRCodeTableProps) => {
	const { token, tableNumber, width = 250 } = props;
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext("2d")!;

		QRCode.toCanvas(
			canvas,
			getTableLink({
				token: token,
				tableNumber: tableNumber,
			}),
			function (error) {
				if (error) console.error(error);
				addTextToCanvas(ctx, canvas, tableNumber);
			}
		);
	}, []);

	const addTextToCanvas = (
		ctx: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
		tableNum: number
	) => {
		const text = `Bàn số ${tableNum}`;

		// Set font properties
		ctx.font = `bold ${16}px Arial`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// Measure text dimensions
		const textMetrics = ctx.measureText(text);
		const textWidth = textMetrics.width;
		const textHeight = 16;

		// Calculate position for text box at the bottom
		const padding = 8;
		const boxWidth = textWidth + padding * 2;
		const boxHeight = textHeight + padding * 2;
		const boxX = (canvas.width - boxWidth) / 2;
		const boxY = canvas.height - boxHeight - 10;

		// Draw background rectangle for text
		ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

		// Draw border around text box
		ctx.lineWidth = 1;
		ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

		// Draw the text
		ctx.fillText(text, canvas.width / 2, boxY + boxHeight / 2);
	};
	return <canvas ref={canvasRef} />;
};

export default QRCodeTable;
