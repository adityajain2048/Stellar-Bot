import express from "express";
const routes = express.Router();
// import { Buy } from "../controllers/buy.controller";
// import { Info } from "../controllers/info.controller";
import { WalletPnl } from "../controllers/pnl.controller";
// import { Sell } from "../controllers/sell.controller";
import { WalletDetails } from "../controllers/walletDetails";
import { TransferToken } from "../controllers/transferToken.controller";
import { TokenInfo } from "../controllers/tokenInfo.controller";
import { SwapToken } from "../controllers/swap.controller";
import { TokenSelection } from "../controllers/tokenSelection";

// routes.get("/",Home);
routes.get("/tokenInfo",TokenInfo);
routes.post("/buyToken", TransferToken);
routes.post("/swap",SwapToken);
// routes.post("/buy", Buy);
// routes.post("/sell",Sell);
// routes.get("/info",Info);
routes.get("/pnl",WalletPnl);
routes.get("/wallet",WalletDetails);
routes.get("/tokenSelection",TokenSelection);


export { routes };
