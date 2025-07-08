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
			}
		);
	}, []);

	return <canvas ref={canvasRef} />;
};

export default QRCodeTable;
