import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

import { User } from "../entities";
import { IAuth, ISignUp } from "../interfaces";
import { roleRepository, userRepository } from "../repositories";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils";

class UserController {
    public static async SignUp(req: Request, res: Response) {
        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações para sign-up..."
            );
        }

        const { name, email, password } = req.body.info as ISignUp;

        if (!email || !password) {
            throw new BadRequestError(
                "Necessário e-mail e senha para criação do usuário..."
            );
        }

        const newUser = await UserController.Create(name, email, password);

        return res.status(201).json(newUser);
    }

    public static async Login(req: Request, res: Response) {
        const { uid } = req.params;

        if (!uid) {
            throw new BadRequestError(
                "Necessário um uid para realizar login..."
            );
        }

        const userRecord = await getAuth().getUser(uid);
        const user = await userRepository.findByUid(uid);

        if (!user) {
            const { email, photoURL: image } = userRecord;

            const newUser = await UserController.Register(
                uid,
                (email as string).split("@")[0],
                email as string,
                image
            );

            return res.status(201).json(newUser);
        }

        return res.json(user);
    }

    public static async Create(
        name: string,
        email: string,
        password: string
    ): Promise<User> {
        const { uid, ..._ } = await getAuth().createUser({
            email,
            password,
        });

        return await UserController.Register(uid, name, email);
    }

    public static async Register(
        uid: string,
        name: string,
        email: string,
        image?: string
    ): Promise<User> {
        const info = {
            uid,
            name,
            email,
            image,
            role: await roleRepository.getIdByName("user"),
        };

        return await userRepository.create(info);
    }

    public static async Get(req: Request, res: Response) {
        const { id } = req.params;

        let result: User | User[];

        if (!id) {
            result = await userRepository.find();
        } else {
            result = await userRepository.findById(id);
        }

        if (!result) {
            throw new NotFoundError("Usuário inexistente...");
        }

        return res.json(result);
    }

    public static async Update(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um id para realizar atualização..."
            );
        }

        const { user, permissions } = req.body.auth as IAuth;

        if (id != user.id && !permissions.users?.update) {
            throw new UnauthorizedError(
                "Não é possível atualizar outros usuários sem autorização..."
            );
        }

        if (!req.body.info) {
            throw new BadRequestError(
                "Espera-se uma propriedade 'info' com as informações à atualizar..."
            );
        }

        const { name, email, image, bio, role, password } = req.body
            .info as Partial<User> & Partial<ISignUp>;

        let userToUpdate: User;

        if (id != user.id) {
            userToUpdate = await userRepository.findById(id);
        } else {
            userToUpdate = user;
        }

        if (email && password) {
            await getAuth().updateUser(userToUpdate.uid, { email, password });
        } else if (email) {
            await getAuth().updateUser(userToUpdate.uid, { email });
        } else if (password) {
            await getAuth().updateUser(userToUpdate.uid, { password });
        }

        userToUpdate.name = name ? name : userToUpdate.name;
        userToUpdate.email = email ? email : userToUpdate.email;
        userToUpdate.image = image ? image : userToUpdate.image;
        userToUpdate.bio = bio ? bio : userToUpdate.bio;
        userToUpdate.role =
            permissions.users?.update && role ? role : userToUpdate.role;

        const userUpdated = await userRepository.update(userToUpdate);

        return res.json(userUpdated);
    }

    public static async Delete(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "Necessário um id para realizar exclusão..."
            );
        }

        const { user, permissions } = req.body.auth as IAuth;

        if (id != user.id && !permissions.users?.delete) {
            throw new UnauthorizedError(
                "Não é possível excluir outros usuários sem autorização..."
            );
        }

        let userToDelete: User;

        if (id != user.id) {
            userToDelete = await userRepository.findById(id);
        } else {
            userToDelete = user;
        }

        await getAuth().deleteUser(userToDelete.uid);

        await userRepository.delete(id);

        return res.status(204).send();
    }
}

export { UserController };
