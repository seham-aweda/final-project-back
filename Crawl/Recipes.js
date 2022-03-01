const mongoose=require('mongoose')
const puppeteer=require('puppeteer')
const recipeModel=require('../Models/recipe.model')

require('dotenv').config()

const URLRecipes = 'https://www.delicious.com.au/recipes/collections/gallery/60-healthy-dinners-you-can-cook-in-30-minutes/1vo4q819?page=60'

const getRecipes = () => {
    puppeteer.launch({headless: false}).then(async (browser) => {
        let page = await browser.newPage()
        page.setViewport({width: 1366, height: 768});
        await page.goto(URLRecipes, {waitUntil: 'domcontentloaded'})

        await arrayOfLinkToRecipes(page)
    })
}
const arrayOfLinkToRecipes = async (page) => {

    await page.waitForSelector("article > header > figure > div > div > a > img.img-responsive.lead-image")
    const linksToGet = await page.evaluate(() => {
        let link= Array.from(document.querySelectorAll("article > header > figure > div > div > a")).map(element => {
            return element.href
        })
        let image= Array.from(document.querySelectorAll('article> header > figure > div > div > a > img.img-responsive.lead-image')).map(element => {
            return element.src
        })
        let arr=[]
        for(let i=0;i<link.length;i++){
            arr.push({link:link[i],imgSource:image[i]})
        }
        console.log('arr',arr)
        console.log('arrLength',arr.length)
        return arr
    })

    await getDataFromLink(page, linksToGet)
}
const getDataFromLink = async (page, array) => {
    for(const link of array) {
        if (link.link.includes('https')) {
            await page.goto(link.link, {waitUntil: 'domcontentloaded'})
            let [ingredients] = await Promise.all([page.evaluate(() => {
                return document.querySelector("body > div.container.main-container > div > main > article > section > div > section.col-xs-12.col-sm-4.ingredients > ul")
                    .innerText
            })])
            let [method] = await Promise.all([page.evaluate(() => {
                return document.querySelector("body > div.container.main-container > div > main > article > section > div > section.col-xs-12.col-sm-8.method-list>ul").innerText
            })])
            let [title] = await Promise.all([page.evaluate(() => {
                return document.querySelector("body > div.container.main-container > div > div.hero.col-xs-12.col-md-8 > header > h1").innerText
            })])
            let imgURL=link.imgSource

            let RecipeObject = {
                INGREDIENTS: ingredients.replaceAll('\n','--'),
                METHOD: method.replaceAll('\n','--'),
                TITLE:title,
                IMG:imgURL
            }
            console.log(RecipeObject)
            saveData(RecipeObject)
        }
    }
}

const saveData=(RecipeObject)=>{

    const recipe = new recipeModel({
        ingredients:RecipeObject.INGREDIENTS,
        methods:RecipeObject.METHOD,
        title:RecipeObject.TITLE,
        photo:RecipeObject.IMG
    })
    recipe.save((err,data)=>{
        if(err) console.log('err',err)
        if(data) console.log(data)
    })

}

        mongoose.connect(`${process.env.DB_URL}`,()=>{
    console.log(('connected to DB'))
})
getRecipes()
