interface ParsedMessage {
    action: string;
    data?: any;
}

// Function to parse message
export function parseMessage(message: string): ParsedMessage {
    // Normalize the message to handle case insensitivity
    const normalizedMessage = message.toLowerCase();

    // Regex patterns for different commands
    const buyPattern = /buy ([a-z0-9]+)(?:\s+for\s+(\d+\.?\d*)\s*([a-z]+))?/i;
    const sellPattern = /sell (\d+%?|\d*\.\d+)?\s*([a-z0-9]+)|([a-z0-9]+)\s+(\d+%?|\d*\.\d+)?/i;
    const showPnlPattern = /\b(show|my) (pnl|account)\b/i;

    // Check for "buy" command
    let match = normalizedMessage.match(buyPattern);
    if (match) {
        return {
            action: 'buy',
            data: {
                toToken: match[1] || null,
                fromAmount: match[2] || null,
                fromToken: match[3] || null
            }
        };
    }

    // Check for "sell" command
    match = normalizedMessage.match(sellPattern);
    if (match) {
        return {
            action: 'sell',
            data: {
                amount: match[1] ||  match[4] || null,
                token: match[2] || match[3]
            }
        };
    }

    // Check for "show pnl" or "my pnl" command
    if (showPnlPattern.test(normalizedMessage)) {
        return {
            action: 'show pnl'
        };
    }

    // Return an undefined action if no patterns match
    return { action: "undefined" };
}