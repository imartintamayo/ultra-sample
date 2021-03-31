import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

@Controller('games')
export class GamesController {

    @Get()
    getGames() {
        return ['game']
    }

    @Get(':gameId')
    getGame(@Param('gameId') gameId: string) {
        return `game${gameId}`
    }

    @Get(':gameId/publisher')
    getPublisher(@Param('gameId') gameId: string) {
        return `publishergame${gameId}`
    }

    @Post()
    createGame() {
        return 'newGame'
    }

    @Put(':gameId')
    updateGame(@Param('gameId') gameId: string, @Body() body) {
        return 'Updated game'
    }

    @Put('apply-discount/:discount/to-games-having-a-release-date-between/:releaseDate1/and/:releaseDate2')
    applyDiscountToGamesHavingAReleaseDateBetween(
        @Param('discount') discount: string,
        @Param('releaseDate1') releaseDate1: string,
        @Param('releaseDate2') releaseDate2: string
    ) {
        return `apply-discount/${discount}/to-games-having-a-release-date-between/${releaseDate1}/and/${releaseDate2}`
    }

    @Delete(':gameId')
    deleteGame(@Param('gameId') gameId: string) {
        return 'Deleted game'
    }

    @Delete('remove-games-with-release-date-older-than/:releaseDate')
    deleteGamesWithReleaseDateOlderThan(@Param('releaseDate') releaseDate: string) {
        return `remove-games-with-release-date-older-than/${releaseDate}`
    }

}
