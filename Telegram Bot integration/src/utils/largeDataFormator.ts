export const largeDataFormator = (data: any) => {
  try {
    if (!data) return data;
    if (data > 1000000000000) {
      return `${(data / 1000000000000).toFixed(2)}T`;
    } else if (data > 1000000000) {
      return `${(data / 1000000000).toFixed(2)}B`;
    } else if (data > 1000000) {
      return `${(data / 1000000).toFixed(2)}M`;
    } else if (data > 1000) {
      return `${(data / 1000).toFixed(2)}K`;
    } else {
      return `${data.length} `;
    }
  } catch (error) {
    console.log("Error in largeDataFormator........", error);
  }
  };