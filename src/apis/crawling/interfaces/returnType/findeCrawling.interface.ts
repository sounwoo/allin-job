import { CompetitionFindeManyType } from '../../types/competition.type';
import { InternFindManyType } from '../../types/intern.type';
import { LanguagefindeManyType } from '../../types/language.type';
import { OutsideFindManyTpye } from '../../types/outside.type';
import { QnetFindeManyType } from '../../types/qnet.type';

export type findCrawling =
    | OutsideFindManyTpye
    | CompetitionFindeManyType
    | InternFindManyType
    | QnetFindeManyType
    | LanguagefindeManyType;
