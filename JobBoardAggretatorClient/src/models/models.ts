
export interface Job{
    Id: number
    Title? : string | null,
    Company?: Company | null,
    Location? : string| null,
    Description? : string| null,
    Url? : string | null
    IsEasyApply: boolean
   }

export interface Company{
    Name? : string | null,
}
