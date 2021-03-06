import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    console.log(createBookDto);
    try {
      const found: Book[] = await this.bookRepo.find(createBookDto);
      if (found.length != 0) throw Error('This book already exists');
      else {
        return await this.bookRepo.save(this.bookRepo.create(createBookDto));
      }
    } catch (Error) {
      console.log(Error.message);
    }
  }

  findAll() {
    return this.bookRepo.find();
  }

  async findOne(Title: string): Promise<Book> {
    const found: Book = await this.bookRepo.findOne({
      where: { title: Title },
    });
    return found;
  }

  async findOneID(wanted: number): Promise<Book> {
    try {
      return await this.bookRepo.findOne({ where: { id: wanted } });
    } catch (error) {
      return error.message;
    }
  }
  //Create multiple update services to make mutliple update endpoints, DIVIDE AND CONQUOER
  async updateTitle(Title: string, newTitle: string) {
    try {
      const book: Book = await this.bookRepo.findOne({
        where: { title: Title },
      });
      if (book) {
        return this.bookRepo.update(book.id, { title: newTitle });
      } else throw Error(`This book doesn't exist!`);
    } catch (Error) {
      return Error.message;
    }
  }

  async updateDesc(Title: string, newDesc: string) {
    try {
      const book: Book = await this.bookRepo.findOne({
        where: { title: Title },
      });
      if (book) {
        return this.bookRepo.update(book.id, { description: newDesc });
      } else throw Error(`This book doesn't exist!`);
    } catch (error) {
      return error.message;
    }
  }

  async remove(Title: string) {
    try {
      const book = await this.bookRepo.findOne({ where: { title: Title } });
      this.bookRepo.remove(book);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
