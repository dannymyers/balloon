export default class RandomUtilities{

    public static RandomIntFromInterval(min: number,max: number)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
}