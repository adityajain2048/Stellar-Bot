export const apiKeysArray = [
    "qyfHOZpolJKPegwvL2t9BrOdAkeLbiF9",
    "IqA2uyCATNdMQikcM2yPXuiYf1GnTexT",
    "f5cOj6wD4aSmoiwS5tYkrdPfUSd1J9oh",
    "jO8FjeeNKWZva8FB8m4ioH2SpePls6U6",
    "R6jrbpgmYhpPaFU1o7D4ds9UDkDllS8X",
    "wNw60wwxKrnH7AghpzBNIbHoOP8wOKXZ",
    "zgC8ZnqPIuCNLvlT4SI5cJZsuzGsfCJF",
    "0F0I2y3LNAwqsymIQrGJ9ztbw95jsCWC",
    "f9HEm132vr1I3lo35YMsMlE0jUJWWrBV",
    "28aNdpa5WmCFUccxz8iPVCrEJ2FnKPRm",
    "QwZcpoJv00fZ8tE9shkvaVMGsLOF8C5s",
    "SxnkbkB7GtkVCsFdovo3Hf8cVCAZxrxB",
    "Hn079mVgyFd2BI82X91ncHdYUkV6OOqL",
    "AyDwPPt2FjCvwpstWSOPVkuy3k7dvuDs",
    "1Vqa5dKIe2VRA0nC8lnBRlZqce0UWW7C",
    "L8pJ73wU5vB8GPJSw48HkjLen8PdD7GT",
    "gDIUDQX3aTPTqX0WADpwynq0Di4qjoZ9",
    "20kRXjoyQ279IvVAypsapH9tVymG4X6o",
    "FBN3CiqLM7tUE3m1Sz5RYcz0VZAclosc",
  ];
  
  let currentIndex = 0;
  export const getApiKey = () => {
    console.log("inside getApiKey...current index....", currentIndex);
    return apiKeysArray[currentIndex++ % apiKeysArray.length];
  };