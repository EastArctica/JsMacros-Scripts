// Some smallCaps implementations use 'ѕ', some use 'ꜱ'
export function smallCaps(str: string): string {
    const l = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const n = ['𝟢', '𝟣', '𝟤', '𝟥', '𝟦', '𝟧', '𝟨', '𝟩', '𝟪', '𝟫'];
    const searches = 'abcdefghijklmnoprstuvwxyzqæƀðʒǝɠɨłꟽɯœɔȣꝵʉγλπρψ'.split('').concat(l);
    const replaces = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘʀѕᴛᴜᴠᴡхʏᴢǫᴁᴃᴆᴣⱻʛᵻᴌꟺꟺɶᴐᴕꝶᵾᴦᴧᴨᴩᴪ'.split('').concat(n);

    let newStr = str.toLowerCase();
    for (let i = 0; i < searches.length; i++) {
        newStr = newStr.split(searches[i]).join(replaces[i]);
    }

    return newStr;
}
